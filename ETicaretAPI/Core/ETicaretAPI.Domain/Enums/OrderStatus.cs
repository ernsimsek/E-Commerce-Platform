namespace ETicaretAPI.Domain.Enums
{
    public enum OrderStatus
    {
        Created = 0,
        Processing = 1,
        PaymentProcessed = 2,
        Shipped = 3,
        Delivered = 4,
        Cancelled = 5
    }
} 