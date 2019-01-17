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
        private readonly PointsGroupService _pointsGroupService;
        private int _userId => Int32.Parse(this.User.Identity.Name);

        public PointController(PointsGroupService pointsGroupService)
        {
            this._pointsGroupService = pointsGroupService;
        }

        [HttpGet("[action]")]
        public IActionResult GetPointsGroups()
        {
            return Ok(this._pointsGroupService.GetPointsGroups(this._userId));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddPointsGroup(PointsGroupInput pointsGroupInput)
        {
            return Ok(await this._pointsGroupService.AddPointsGroupAsync(this._userId, pointsGroupInput));
            
            
        }
    }
}