using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Calc;
using Calc.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class CalcController : Controller
    {
        // TODO: Add other async methods
        // TODO: Add EF tests
        // TODO: Play around more with dependency injection, ie don't just register interfaces
        // TODO: Use a code generator or something to copy all this
        // TODO: consider implementing unit of work pattern
        [HttpPost("[action]")]
        public IActionResult GetAgglomerativeHierarchicalClusters([FromBody] IEnumerable<Point> points)
        {
            try
            {
                return Ok(AgglomerativeHierarchicalClusteringService.GetModel(points));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}