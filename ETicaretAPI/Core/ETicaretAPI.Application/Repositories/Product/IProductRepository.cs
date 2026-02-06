using ETicaretAPI.Domain.Entites;

namespace ETicaretAPI.Application.Repositories
{
    public interface IProductRepository : IReadRepository<Product>, IWriteRepository<Product>
    {
    }
} 