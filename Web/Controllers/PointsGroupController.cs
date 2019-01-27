using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Web.Models;
using Web.Services;
using WebApplication.Models;
using WebApplication.Models.DTOs;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class PointsGroupController : Controller
    {
        private readonly PointsGroupService _pointsGroupService;
        private int _userId => UserIdProvider.GetUserId(this.User);

        public PointsGroupController(PointsGroupService pointsGroupService)
        {
            this._pointsGroupService = pointsGroupService;
        }

        [HttpGet("[action]")]
        public IActionResult GetPointsGroups()
        {
            return Ok(this._pointsGroupService.GetPointsGroups(this._userId));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddPointsGroup(IFormFile file)
        {
            if (file.Length == 0)
            {
                return BadRequest("The file did not exist.");
            }
            
            return Ok(await this._pointsGroupService.AddPointsGroupAsync(this._userId, file));
        }

        [HttpPost("[action]")]
        public IActionResult CreatePointsGroup([FromBody] IFormFile file)
        {
            if (file.Length == 0)
            {
                return BadRequest("The file did not exist.");
            }
            
            return Ok(this._pointsGroupService.CreatePointsGroupAsync(file));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SavePointsGroup([FromBody] PointsGroupDTO pointsGroupDto)
        {
            return Ok(await this._pointsGroupService.SavePointsGroupAsync(pointsGroupDto));
        }

        [HttpDelete("[action]/{pointsGroupId}")]
        public async Task<IActionResult> DeletePointsGroup(int pointsGroupId)
        {
            return Ok(await this._pointsGroupService.DeletePointsGroupAsync(pointsGroupId));
        }
    }
}