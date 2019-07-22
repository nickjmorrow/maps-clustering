using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private readonly FileHandlerService _fileHandlerService;

        public FileController(FileHandlerService fileHandlerService)
        {
            this._fileHandlerService = fileHandlerService;
        }

        [HttpPost("[action]")]
        public IActionResult ConvertFileToPoints(IFormFile file)
        {
            if (file.Length == 0)
            {
                return BadRequest();
            }

            return Ok(this._fileHandlerService.ConvertFileToPointsGroupModel(file));
        }
    }
}