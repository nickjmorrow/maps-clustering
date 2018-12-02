using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Models;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class WizardController : Controller
    {
        private WizardService _wizardService;

        public WizardController(WizardService wizardService)
        {
            this._wizardService = wizardService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Add([FromBody] Wizard wizard)
        {
            return Ok(await this._wizardService.AddAsync(wizard));
        }
        
        [HttpGet("[action]")]
        public async Task<IActionResult> Get()
        {
            return Ok(await this._wizardService.GetAsync());
        }
        
        [HttpPut("[action]")]
        public async Task<IActionResult> Update([FromBody] Wizard wizard)
        {
            return Ok(await this._wizardService.UpdateAsync(wizard));
        }

        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await this._wizardService.DeleteAsync(id));
        }
    }
}