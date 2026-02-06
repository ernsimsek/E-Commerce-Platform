using ETicaretAPI.Application.Abstractions.Hubs;
using ETicaretAPI.Application.Repositories;
using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.ValueObjects;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ETicaretAPI.Application.Features.Commands.Product.CreateProduct
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommandRequest, CreateProductCommandResponse>
    {
        readonly IProductWriteRepository _productWriteRepository;
        readonly IProductHubService _productHubService;
        readonly IUnitOfWork _unitOfWork;

        public CreateProductCommandHandler(IProductWriteRepository productWriteRepository, IProductHubService productHubService, IUnitOfWork unitOfWork)
        {
            _productWriteRepository = productWriteRepository;
            _productHubService = productHubService;
            _unitOfWork = unitOfWork;
        }

        public async Task<CreateProductCommandResponse> Handle(CreateProductCommandRequest request, CancellationToken cancellationToken)
        {
            // Create Money object for price
            Money price = Money.Create(request.Price, "TRY");
            
            // Create Stock object
            Stock stock = Stock.Create(request.Stock);

            // Create the product with all required parameters
            var product = Domain.Entites.Product.Create(
                request.Name,
                price,
                stock,
                request.Description,
                request.Brand,
                request.Type
            );

            await _productWriteRepository.AddAsync(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await _productHubService.ProductAddedMessageAsync($"{request.Name} isminde ürün eklenmiştir.");

            return new CreateProductCommandResponse
            {
                Success = true,
                Id = product.Id
            };
        }
    }
}
