using ETicaretAPI.Application.Repositories;
using ETicaretAPI.Domain.Exceptions;
using MediatR;
using P = ETicaretAPI.Domain.Entites;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace ETicaretAPI.Application.Features.Queries.Product.GetByIdProduct
{
    public class GetByIdProductQueryHandler : IRequestHandler<GetByIdProductQueryRequest, GetByIdProductQueryResponse>
    {
        readonly IProductReadRepository _productReadRepository;
        public GetByIdProductQueryHandler(IProductReadRepository productReadRepository)
        {
            _productReadRepository = productReadRepository;
        }

        public async Task<GetByIdProductQueryResponse> Handle(GetByIdProductQueryRequest request, CancellationToken cancellationToken)
        {
            P.Product product = await _productReadRepository.GetByIdAsync(request.Id, false);
            
            if (product == null)
                throw new EntityNotFoundException(nameof(P.Product), request.Id.ToString());
                
            return new()
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price.Amount,
                Currency = product.Price.Currency,
                Stock = product.Stock.Value,
                Description = product.Description,
                Brand = product.Brand,
                Type = product.Type
            };
        }
    }
}
