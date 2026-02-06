using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETicaretAPI.Application.Features.Commands.Product.UpdateProduct
{
    public class UpdateProductCommandRequest : IRequest<UpdateProductCommandResponse>
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public int Stock { get; set; }
        public decimal Price { get; set; }
        public required string Description { get; set; }
        public required string Brand { get; set; }
        public required string Type { get; set; }
    }
}
