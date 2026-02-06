using ETicaretAPI.Domain.Entites;
using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.Entites.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ETicaretAPI.Persistence.Contexts
{
    public class ETicaretAPIDbContext : IdentityDbContext<AppUser, AppRole, string>
    {
        public ETicaretAPIDbContext(DbContextOptions options) : base(options)
        { }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Domain.Entites.File> Files { get; set; }
        public DbSet<ProductImageFile> ProductImageFiles { get; set; }
        public DbSet<InvoiceFile> InvoiceFiles { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketItem> BasketItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Order>()
                .HasKey(b => b.Id);

            builder.Entity<Basket>()
                .HasOne(b => b.Order)
                .WithOne(o => o.Basket)
                .HasForeignKey<Order>(o => o.Id);

            builder.Entity<Customer>(b =>
            {
                b.OwnsOne(c => c.ShippingAddress, sa =>
                {
                    sa.WithOwner();
                    sa.Property(a => a.Street).HasColumnName("ShippingStreet");
                    sa.Property(a => a.City).HasColumnName("ShippingCity");
                    sa.Property(a => a.State).HasColumnName("ShippingState");
                    sa.Property(a => a.Country).HasColumnName("ShippingCountry");
                    sa.Property(a => a.ZipCode).HasColumnName("ShippingZipCode");
                });

                b.OwnsOne(c => c.BillingAddress, ba =>
                {
                    ba.WithOwner();
                    ba.Property(a => a.Street).HasColumnName("BillingStreet");
                    ba.Property(a => a.City).HasColumnName("BillingCity");
                    ba.Property(a => a.State).HasColumnName("BillingState");
                    ba.Property(a => a.Country).HasColumnName("BillingCountry");
                    ba.Property(a => a.ZipCode).HasColumnName("BillingZipCode");
                });
            });

            builder.Entity<Order>(b =>
            {
                b.OwnsOne(o => o.ShippingAddress, sa =>
                {
                    sa.WithOwner();
                    sa.Property(a => a.Street).HasColumnName("ShippingStreet");
                    sa.Property(a => a.City).HasColumnName("ShippingCity");
                    sa.Property(a => a.State).HasColumnName("ShippingState");
                    sa.Property(a => a.Country).HasColumnName("ShippingCountry");
                    sa.Property(a => a.ZipCode).HasColumnName("ShippingZipCode");
                });

                b.OwnsOne(o => o.BillingAddress, ba =>
                {
                    ba.WithOwner();
                    ba.Property(a => a.Street).HasColumnName("BillingStreet");
                    ba.Property(a => a.City).HasColumnName("BillingCity");
                    ba.Property(a => a.State).HasColumnName("BillingState");
                    ba.Property(a => a.Country).HasColumnName("BillingCountry");
                    ba.Property(a => a.ZipCode).HasColumnName("BillingZipCode");
                });

                b.OwnsOne(o => o.TotalAmount, m =>
                {
                    m.WithOwner();
                    m.Property(p => p.Amount).HasColumnName("TotalAmount");
                    m.Property(p => p.Currency).HasColumnName("Currency");
                });

                b.OwnsOne(o => o.PaymentMethod, pm =>
                {
                    pm.WithOwner();
                    pm.Property(p => p.Type).HasColumnName("PaymentType");
                    pm.Property(p => p.CardNumber).HasColumnName("CardNumber");
                    pm.Property(p => p.CardHolderName).HasColumnName("CardHolderName");
                    pm.Property(p => p.ExpirationDate).HasColumnName("ExpirationDate");
                    pm.Property(p => p.Cvv).HasColumnName("CVV");
                });
            });

            builder.Entity<Basket>(b =>
            {
                b.OwnsOne(o => o.TotalAmount, m =>
                {
                    m.WithOwner();
                    m.Property(p => p.Amount).HasColumnName("TotalAmount");
                    m.Property(p => p.Currency).HasColumnName("Currency");
                });
            });

            builder.Entity<BasketItem>(b =>
            {
                b.OwnsOne(bi => bi.UnitPrice, m =>
                {
                    m.WithOwner();
                    m.Property(p => p.Amount).HasColumnName("UnitPrice");
                    m.Property(p => p.Currency).HasColumnName("Currency");
                });

                b.OwnsOne(bi => bi.TotalPrice, m =>
                {
                    m.WithOwner();
                    m.Property(p => p.Amount).HasColumnName("TotalPrice");
                    m.Property(p => p.Currency).HasColumnName("Currency");
                });
            });

            builder.Entity<OrderItem>(b =>
            {
                b.OwnsOne(oi => oi.UnitPrice, m =>
                {
                    m.WithOwner();
                    m.Property(p => p.Amount).HasColumnName("UnitPrice");
                    m.Property(p => p.Currency).HasColumnName("Currency");
                });

                b.OwnsOne(oi => oi.TotalPrice, m =>
                {
                    m.WithOwner();
                    m.Property(p => p.Amount).HasColumnName("TotalPrice");
                    m.Property(p => p.Currency).HasColumnName("Currency");
                });
            });

            builder.Entity<Product>(b =>
            {
                b.OwnsOne(p => p.Price, m =>
                {
                    m.WithOwner();
                    m.Property(p => p.Amount).HasColumnName("Price");
                    m.Property(p => p.Currency).HasColumnName("Currency");
                });

                b.OwnsOne(p => p.Stock, s =>
                {
                    s.WithOwner();
                    s.Property(s => s.Value).HasColumnName("Stock");
                });
            });

            base.OnModelCreating(builder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var datas = ChangeTracker
                .Entries<BaseEntity>();

            foreach (var data in datas)
            {
                switch (data.State)
                {
                    case EntityState.Added:
                        data.Property("CreatedDate").CurrentValue = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        data.Property("UpdatedDate").CurrentValue = DateTime.UtcNow;
                        break;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
} 