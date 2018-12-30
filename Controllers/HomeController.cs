using System.Collections.Generic;
using System.IO;
using System;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using Calc;
using Calc.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class HomeController : Controller
    {
        private FileHandlerService _fileHandlerService;

        public HomeController(FileHandlerService fileHandlerService)
        {
            this._fileHandlerService = fileHandlerService;
        }

        [HttpGet("[action]")]
        public IEnumerable<int> GetValues()
        {
            return new List<int>() {2, 3, 4};
        }
        
        [HttpPost("[action]")]
        public async Task<IActionResult> ReceiveFile(List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);

            // full path to file in temp location
            var filePath = Path.GetTempFileName();

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }

            return Ok(new { count = files.Count, size, filePath});
        }
        
        [HttpPost]
        [Route("upload")]
        public IActionResult Upload(IFormFile file) {
            if (file.Length == 0)
            {
                return BadRequest();
            }

            var points = this._fileHandlerService.ConvertFileToPoints(file);
//            var clusterPoints = AgglomerativeHierarchicalClusteringService.GetModel(points);

            return Ok(points);
        }
    }
}