using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Services;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public partial class PointController : Controller
    {
        private readonly PointService _pointService;
        private int _userId => Int32.Parse(this.User.Identity.Name);

        public PointController(PointService pointService)
        {
            this._pointService = pointService;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetPoints()
        {
            return Ok(await this._pointService.GetPointsAsync(this._userId));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddPointsGroup(PointsGroupInput pointsGroupInput)
        {
            return Ok(await this._pointService.AddPointsGroupAsync(this._userId, pointsGroupInput));
            
            
        }
    }
}