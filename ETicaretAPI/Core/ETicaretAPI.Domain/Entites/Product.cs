using System;
using System.Collections.Generic;
using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.Events;
using ETicaretAPI.Domain.ValueObjects;
using ETicaretAPI.Domain.Entites.Identity;
using ETicaretAPI.Domain.Exceptions;

namespace ETicaretAPI.Domain.Entites
{
    public class Product : BaseEntity
    {
        public string Name { get; private set; } = null!;
        public Money Price { get; private set; } = null!;
        public Stock Stock { get; private set; } = null!;
        public string Description { get; private set; } = null!;
        public string Brand { get; private set; } = string.Empty;
        public string Type { get; private set; } = string.Empty;
        public string? PictureUrl { get; private set; }
        public bool IsActive { get; private set; } = true;
        public ICollection<Order> Orders { get; private set; } = new List<Order>();
        public ICollection<ProductImageFile> ProductImageFiles { get; private set; } = new List<ProductImageFile>();
        public ICollection<BasketItem> BasketItems { get; private set; } = new List<BasketItem>();

        private Product()
        {
            // Private constructor for EF Core
        }

        private Product(string name, Money price, Stock stock, string description, string brand, string type, string? pictureUrl = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new Exceptions.DomainException("Product name cannot be empty");
            if (string.IsNullOrWhiteSpace(description))
                throw new Exceptions.DomainException("Product description cannot be empty");

            Name = name;
            Price = price;
            Stock = stock;
            Description = description;
            Brand = brand ?? string.Empty;
            Type = type ?? string.Empty;
            PictureUrl = pictureUrl;
            IsActive = true;
            Orders = new List<Order>();
            ProductImageFiles = new List<ProductImageFile>();
            BasketItems = new List<BasketItem>();

            AddDomainEvent(new ProductCreatedEvent(this));
        }

        public static Product Create(string name, Money price, Stock stock, string description, string brand, string type, string? pictureUrl = null)
        {
            return new Product(name, price, stock, description, brand, type, pictureUrl);
        }

        public void Update(string name, Money price, Stock stock, string description, string brand, string type, string? pictureUrl = null)
        {
            Name = name;
            Price = price;
            Stock = stock;
            Description = description;
            Brand = brand;
            Type = type;
            PictureUrl = pictureUrl;

            AddDomainEvent(new ProductUpdatedEvent(this));
        }

        public void UpdateDetails(string name, Money price, string description, string brand, string type, string? pictureUrl = null)
        {
            Name = name;
            Price = price;
            Description = description;
            Brand = brand;
            Type = type;
            PictureUrl = pictureUrl;

            AddDomainEvent(new ProductUpdatedEvent(this));
        }

        public void UpdateStock(Stock stock)
        {
            Stock = stock;
            AddDomainEvent(new ProductStockUpdatedEvent(this));
        }

        public void Activate()
        {
            if (IsActive)
                return;

            IsActive = true;
            AddDomainEvent(new ProductActivatedEvent(this));
        }

        public void Deactivate()
        {
            if (!IsActive)
                return;

            IsActive = false;
            AddDomainEvent(new ProductDeactivatedEvent(this));
        }

        public void AddStock(int quantity)
        {
            if (quantity <= 0)
                throw new Exceptions.DomainException("Quantity must be greater than zero");

            Stock = Stock.Add(quantity);
            AddDomainEvent(new ProductStockIncreasedEvent(this, quantity));
        }

        public void RemoveStock(int quantity)
        {
            if (quantity <= 0)
                throw new Exceptions.DomainException("Quantity must be greater than zero");

            if (Stock.Value < quantity)
                throw new Exceptions.DomainException("Insufficient stock");

            Stock = Stock.Subtract(quantity);
            AddDomainEvent(new ProductStockDecreasedEvent(this, quantity));
        }
    }
}
