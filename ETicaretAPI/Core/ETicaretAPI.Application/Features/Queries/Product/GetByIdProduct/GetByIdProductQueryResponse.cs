using ETicaretAPI.Domain.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETicaretAPI.Application.Features.Queries.Product.GetByIdProduct
{
    public class GetByIdProductQueryResponse
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public int Stock { get; set; }
        public decimal Price { get; set; }
        public required string Currency { get; set; }
        public required string Description { get; set; }
        public required string Brand { get; set; }
        public required string Type { get; set; }
    }
}
