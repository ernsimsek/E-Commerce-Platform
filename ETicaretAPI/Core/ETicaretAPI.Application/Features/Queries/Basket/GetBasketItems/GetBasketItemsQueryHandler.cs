using ETicaretAPI.Application.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ETicaretAPI.Application.Features.Queries.Basket.GetBasketItems
{
    public class GetBasketItemsQueryHandler : IRequestHandler<GetBasketItemsQueryRequest, List<GetBasketItemsQueryResponse>>
    {
        readonly IBasketReadRepository _basketReadRepository;
        
        public GetBasketItemsQueryHandler(IBasketReadRepository basketReadRepository)
        {
            _basketReadRepository = basketReadRepository;
        }

        public async Task<List<GetBasketItemsQueryResponse>> Handle(GetBasketItemsQueryRequest request, CancellationToken cancellationToken)
        {
            Domain.Entites.Basket? basket = await _basketReadRepository.Table
                .Include(b => b.Items)
                .ThenInclude(bi => bi.Product)
                .FirstOrDefaultAsync(b => b.UserId == request.UserId);

            return basket?.Items.Select(bi => new GetBasketItemsQueryResponse
            {
                BasketItemId = bi.Id,
                ProductId = bi.ProductId,
                Name = bi.Product.Name,
                Price = bi.UnitPrice.Amount,
                Quantity = bi.Quantity
            }).ToList() ?? new();
        }
    }
}
