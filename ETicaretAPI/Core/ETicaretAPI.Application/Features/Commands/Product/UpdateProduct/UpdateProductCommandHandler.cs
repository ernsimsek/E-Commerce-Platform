using ETicaretAPI.Application.Repositories;
using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.Entites;
using ETicaretAPI.Domain.ValueObjects;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ETicaretAPI.Application.Features.Commands.Product.UpdateProduct
{
    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommandRequest, UpdateProductCommandResponse>
    {
        private readonly IProductReadRepository _productReadRepository;
        private readonly IProductWriteRepository _productWriteRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateProductCommandHandler(IProductReadRepository productReadRepository, IProductWriteRepository productWriteRepository, IUnitOfWork unitOfWork)
        {
            _productReadRepository = productReadRepository;
            _productWriteRepository = productWriteRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UpdateProductCommandResponse> Handle(UpdateProductCommandRequest request, CancellationToken cancellationToken)
        {
            Domain.Entites.Product product = await _productReadRepository.GetByIdAsync(request.Id);
            if (product == null)
                throw new Exception("Product not found");

            // Create Money object for price
            Money price = Money.Create(request.Price, "TRY");

            // Use UpdateDetails method to update product information
            product.UpdateDetails(request.Name, price, request.Description, request.Brand, request.Type);
            
            // Update stock separately
            product.UpdateStock(Stock.Create(request.Stock));

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new UpdateProductCommandResponse
            {
                Success = true
            };
        }
    }
}
