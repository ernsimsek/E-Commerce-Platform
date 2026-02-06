using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.Exceptions;

namespace ETicaretAPI.Domain.Entites
{
    public class File : BaseEntity
    {
        public string FileName { get; private set; }
        public string Path { get; private set; }
        public string Storage { get; private set; }
        public string ContentType { get; private set; }
        public long Size { get; private set; }

        protected File() { } // For EF Core

        public File(string fileName, string path, string storage, string contentType, long size)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                throw new Exceptions.DomainException("File name cannot be empty");

            if (string.IsNullOrWhiteSpace(path))
                throw new Exceptions.DomainException("File path cannot be empty");

            if (string.IsNullOrWhiteSpace(storage))
                throw new Exceptions.DomainException("Storage cannot be empty");

            if (string.IsNullOrWhiteSpace(contentType))
                throw new Exceptions.DomainException("Content type cannot be empty");

            if (size <= 0)
                throw new Exceptions.DomainException("File size must be greater than zero");

            FileName = fileName;
            Path = path;
            Storage = storage;
            ContentType = contentType;
            Size = size;
        }
    }
}
