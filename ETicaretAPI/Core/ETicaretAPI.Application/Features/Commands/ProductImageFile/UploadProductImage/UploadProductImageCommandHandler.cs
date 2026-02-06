using ETicaretAPI.Application.Abstractions.Storage;
using ETicaretAPI.Application.Repositories;
using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.Entites;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ETicaretAPI.Application.Features.Commands.ProductImageFile.UploadProductImage
{
    public class UploadProductImageCommandHandler : IRequestHandler<UploadProductImageCommandRequest, UploadProductImageCommandResponse>
    {
        readonly IStorageService _storageService;
        readonly IProductReadRepository _productReadRepository;
        readonly IProductImageFileWriteRepository _productImageFileWriteRepository;
        readonly IUnitOfWork _unitOfWork;

        public UploadProductImageCommandHandler(IStorageService storageService, IProductReadRepository productReadRepository, IProductImageFileWriteRepository productImageFileWriteRepository, IUnitOfWork unitOfWork)
        {
            _storageService = storageService;
            _productReadRepository = productReadRepository;
            _productImageFileWriteRepository = productImageFileWriteRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UploadProductImageCommandResponse> Handle(UploadProductImageCommandRequest request, CancellationToken cancellationToken)
        {
            var product = await _productReadRepository.GetByIdAsync(Guid.Parse(request.Id));
            if (product == null)
                throw new Domain.Exceptions.EntityNotFoundException(nameof(Product), request.Id);

            List<(string fileName, string pathOrContainerName)> result = await _storageService.UploadAsync("photo-images", request.Files);

            // Create new image files and associate them with the product
            List<Domain.Entites.ProductImageFile> productImageFiles = new();
            foreach (var (fileName, pathOrContainerName) in result)
            {
                var file = request.Files.FirstOrDefault(f => f.FileName == fileName);
                
                if (file == null && request.Files.Count > 0)
                {
                    file = request.Files[0];
                    Console.WriteLine($"Warning: No file with name {fileName} found. Using the first file instead.");
                }
                
                var productImageFile = new Domain.Entites.ProductImageFile(
                    fileName,
                    pathOrContainerName,
                    _storageService.StorageName,
                    file?.ContentType ?? "application/octet-stream",
                    file?.Length ?? 0
                );
                
                // Associate with product
                productImageFile.Products.Add(product);
                productImageFiles.Add(productImageFile);
            }

            await _productImageFileWriteRepository.AddRangeAsync(productImageFiles);
            await _unitOfWork.SaveChangesAsync();

            return new();
        }
    }
}
