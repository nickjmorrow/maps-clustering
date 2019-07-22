using Microsoft.AspNetCore.Mvc;
using Web.Services;

namespace WebApplication.Controllers
{
    
    [Route("api/[controller]")]
    public class DatabaseSettingController : Controller
    {
        private readonly DatabaseSettingService _databaseSettingService;

        public DatabaseSettingController(DatabaseSettingService databaseSettingService)
        {
            this._databaseSettingService = databaseSettingService;
        }

        [HttpGet("[action]/{settingId}")]
        public IActionResult GetSettingValue(string settingId)
        {
            return Ok(this._databaseSettingService.GetSettingValue(settingId));
        }

        [HttpGet("[action]")]
        public IActionResult GetDatabaseSettings()
        {
            return Ok(this._databaseSettingService.GetDatabaseSettings());
        }
    }
}