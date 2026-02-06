using ETicaretAPI.Domain.Exceptions;
using System.Collections.Generic;

namespace ETicaretAPI.Domain.Entites
{
    public class ProductImageFile : File
    {
        public ProductImageFile()
        {
            Products = new HashSet<Product>();
        }

        public ProductImageFile(string fileName, string path, string storage, string contentType, long size = 0) 
            : base(fileName, path, storage, contentType, size)
        {
            Products = new HashSet<Product>();
            Showcase = false;
        }

        public ProductImageFile(string fileName, string path, string storage, string contentType) 
            : base(fileName, path, storage, contentType, 0)
        {
            Products = new HashSet<Product>();
            Showcase = false;
        }

        public bool Showcase { get; set; }
        public ICollection<Product> Products { get; set; } = new HashSet<Product>();
    }
}
