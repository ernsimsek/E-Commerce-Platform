using ETicaretAPI.Application.Abstractions.Services;
using ETicaretAPI.Application.Repositories;
using ETicaretAPI.Application.ViewModels.Baskets;
using ETicaretAPI.Domain.Entites;
using ETicaretAPI.Domain.Entites.Identity;
using ETicaretAPI.Domain.ValueObjects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ETicaretAPI.Persistence.Services
{
    public class BasketService : IBasketService
    {
        readonly IHttpContextAccessor _httpContextAccessor;
        readonly UserManager<AppUser> _userManager;
        readonly IOrderReadRepository _orderReadRepository;
        readonly IBasketWriteRepository _basketWriteRepository;
        readonly IBasketReadRepository _basketReadRepository;
        readonly IBasketItemWriteRepository _basketItemWriteRepository;
        readonly IBasketItemReadRepository _basketItemReadRepository;
        readonly IProductReadRepository _productReadRepository;

        public BasketService(
            IHttpContextAccessor httpContextAccessor,
            UserManager<AppUser> userManager,
            IOrderReadRepository orderReadRepository,
            IBasketWriteRepository basketWriteRepository,
            IBasketItemWriteRepository basketItemWriteRepository,
            IBasketItemReadRepository basketItemReadRepository,
            IBasketReadRepository basketReadRepository,
            IProductReadRepository productReadRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _orderReadRepository = orderReadRepository;
            _basketWriteRepository = basketWriteRepository;
            _basketItemWriteRepository = basketItemWriteRepository;
            _basketItemReadRepository = basketItemReadRepository;
            _basketReadRepository = basketReadRepository;
            _productReadRepository = productReadRepository;
        }

        private async Task<Basket> ContextUser()
        {
            var username = _httpContextAccessor?.HttpContext?.User?.Identity?.Name;
            if (string.IsNullOrEmpty(username))
                throw new Exception("User not authenticated");

            AppUser? user = await _userManager.Users
                .FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
                throw new Exception("User not found");

            var userId = new Guid(user.Id);
            
            // Find active basket (without an associated order)
            var activeBasket = await _basketReadRepository.Table
                .Include(b => b.Order)
                .FirstOrDefaultAsync(b => b.UserId == userId && b.Order == null);

            if (activeBasket == null)
            {
                activeBasket = new Basket(userId);
                await _basketWriteRepository.AddAsync(activeBasket);
                await _basketWriteRepository.SaveAsync();
            }

            return activeBasket;
        }

        public async Task AddItemToBasketAsync(VM_Create_BasketItem basketItem)
        {
            var basket = await ContextUser();
            var product = await _productReadRepository.GetByIdAsync(new Guid(basketItem.ProductId));
            if (product == null)
                throw new Exception("Product not found");

            basket.AddItem(product.Id, basketItem.Quantity, product.Price);
            await _basketWriteRepository.SaveAsync();
        }

        public async Task<List<BasketItem>> GetBasketItemsAsync()
        {
            var basket = await ContextUser();
            return basket.Items.ToList();
        }

        public async Task RemoveBasketItemAsync(string basketItemId)
        {
            var basket = await ContextUser();
            var item = basket.Items.FirstOrDefault(i => i.Id == new Guid(basketItemId));
            if (item != null)
            {
                basket.RemoveItem(item.ProductId);
                await _basketWriteRepository.SaveAsync();
            }
        }

        public async Task UpdateQuantityAsync(VM_Update_BasketItem basketItem)
        {
            var basket = await ContextUser();
            var item = basket.Items.FirstOrDefault(i => i.Id == new Guid(basketItem.BasketItemId));
            if (item != null)
            {
                basket.UpdateItemQuantity(item.ProductId, basketItem.Quantity);
                await _basketWriteRepository.SaveAsync();
            }
        }
    }
} 