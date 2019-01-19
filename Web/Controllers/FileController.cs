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
    public class FileController : Controller
    {
        private FileHandlerService _fileHandlerService;

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

            return Ok(this._fileHandlerService.ConvertFileToPointsGroup(file));
        }
    }
}