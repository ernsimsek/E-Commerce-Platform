using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.IO;

namespace ETicaretAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _configuration;
        private readonly ILogger<FilesController> _logger;

        public FilesController(IWebHostEnvironment hostingEnvironment, IConfiguration configuration, ILogger<FilesController> logger)
        {
            _hostingEnvironment = hostingEnvironment;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet("GetBaseStorageUrl")]
        public IActionResult GetBaseStorageUrl()
        {
            return Ok(new { url = _configuration["BaseStorageUrl"] });
        }

        [HttpGet("photo-image/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            try
            {
                // Dizin yolu
                string directoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "photo-images");
                
                // Dosya tam yolu
                string filePath = Path.Combine(directoryPath, fileName);
                
                _logger.LogInformation($"Requesting file: {filePath}");
                
                // Dosya var mı kontrol et
                if (!System.IO.File.Exists(filePath))
                {
                    _logger.LogWarning($"File not found: {filePath}");
                    return NotFound($"Dosya bulunamadı: {fileName}");
                }

                // Dosya türünü belirle
                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(filePath, out var contentType))
                {
                    contentType = "application/octet-stream";
                }

                // Dosya içeriğini oku
                var fileBytes = System.IO.File.ReadAllBytes(filePath);
                
                _logger.LogInformation($"File found: {filePath}, size: {fileBytes.Length} bytes, content type: {contentType}");
                
                // Resmi döndür
                return File(fileBytes, contentType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving image: {fileName}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
