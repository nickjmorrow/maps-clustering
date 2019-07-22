using Microsoft.AspNetCore.Mvc;
using Web.Services;

namespace WebApplication.Controllers
{
    
    [Route("api/[controller]")]
    public class DatabaseSettingController : Controller
    {
        private readonly DatabaseSettingProvider _databaseSettingProvider;

        public DatabaseSettingController(DatabaseSettingProvider databaseSettingProvider)
        {
            this._databaseSettingProvider = databaseSettingProvider;
        }

        [HttpGet("[action]/{settingId}")]
        public IActionResult GetSettingValue(string settingId)
        {
            return Ok(this._databaseSettingProvider.GetSettingValue(settingId));
        }

        [HttpGet("[action]")]
        public IActionResult GetDatabaseSettings()
        {
            return Ok(this._databaseSettingProvider.GetDatabaseSettings());
        }
    }
}