using ETicaretAPI.Application.ViewModels.Products;
using FluentValidation;

namespace ETicaretAPI.Application.Validators.Products
{
    public class CreateProductValidator: AbstractValidator<VM_Create_Product>
    {
        public CreateProductValidator() 
        {
            RuleFor(p => p.Name)
                .NotEmpty()
                .NotNull()
                     .WithMessage("Lütfen ürün adını giriniz.")
                .MaximumLength(150)
                .MinimumLength(5)
                    .WithMessage("LÜtfen ürün adını 5 ile 150 karakter arasında giriniz.");

             RuleFor(p => p.Stock)
                .NotEmpty()
                .NotNull()
                    .WithMessage("Lütfen stock bilgisini giriniz.")
                .Must(s => s >= 0)
                    .WithMessage("Stock bilgisi negatif olamaz!");

            RuleFor(p => p.Price)
               .NotEmpty()
               .NotNull()
                   .WithMessage("Lütfen fiyat bilgisini giriniz.")
               .Must(s => s >= 0)
                   .WithMessage("Fiyat bilgisi negatif olamaz!");


        }
    }
}
