using ETicaretAPI.Application.Abstractions.Storage;
using ETicaretAPI.Application.Abstractions.Storage.Local;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace ETicaretAPI.Infrastructure.Services.Storage.Local;

public class LocalStorage : Storage, ILocalStorage
{
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly IConfiguration _configuration;

    public LocalStorage(IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
    {
        _webHostEnvironment = webHostEnvironment;
        _configuration = configuration;
    }

    public override async Task<List<(string fileName, string pathOrContainerName)>> UploadAsync(string pathOrContainerName, IFormFileCollection files)
    {
        string uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, pathOrContainerName);
        if (!Directory.Exists(uploadPath))
            Directory.CreateDirectory(uploadPath);

        List<(string fileName, string pathOrContainerName)> datas = new();
        foreach (IFormFile file in files)
        {
            string fileNewName = await FileRenameAsync(pathOrContainerName, file.FileName, HasFile);

            await CopyFileAsync($"{uploadPath}/{fileNewName}", file);
            datas.Add((fileNewName, $"{pathOrContainerName}/{fileNewName}"));
        }

        return datas;
    }

    public override async Task DeleteAsync(string pathOrContainerName, string fileName)
    {
        string filePath = Path.Combine(_webHostEnvironment.WebRootPath, pathOrContainerName, fileName);
        if (File.Exists(filePath))
            File.Delete(filePath);
    }

    public override List<string> GetFiles(string pathOrContainerName)
    {
        DirectoryInfo directory = new(Path.Combine(_webHostEnvironment.WebRootPath, pathOrContainerName));
        return directory.GetFiles().Select(f => f.Name).ToList();
    }

    public override bool HasFile(string pathOrContainerName, string fileName)
    {
        string filePath = Path.Combine(_webHostEnvironment.WebRootPath, pathOrContainerName, fileName);
        return File.Exists(filePath);
    }

    private async Task<bool> CopyFileAsync(string path, IFormFile file)
    {
        try
        {
            await using FileStream fileStream = new(path, FileMode.Create, FileAccess.Write, FileShare.None, 1024 * 1024, useAsync: false);
            await file.CopyToAsync(fileStream);
            await fileStream.FlushAsync();
            return true;
        }
        catch (Exception)
        {
            throw;
        }
    }
}
