using MediatR;

namespace ETicaretAPI.Application.Features.Commands.Basket.AddItemToBasket
{
    public class AddItemToBasketCommandRequest : IRequest<AddItemToBasketCommandResponse>
    {
        public required string ProductId { get; set; }
        public int Quantity { get; set; }
    }
}