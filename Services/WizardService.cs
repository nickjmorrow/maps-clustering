using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication.Models;

namespace WebApplication.Services
{

    public class WizardService
    {
        private readonly DatabaseContext _context;

        public WizardService(DatabaseContext context)
        {
            this._context = context;
        }
        
        public async Task<IEnumerable<Wizard>> GetAsync()
        {
            using (var context = this._context)
            {
                return await context
                    .Wizards
                    .Include(w => w.WizardSpells)
                    .ToListAsync();
            }
        }

        public async Task<Wizard> AddAsync(Wizard wizard)
        {
            if (wizard == null)
            {
                throw new ArgumentException();
            }
            
            using (var context = this._context)
            {
                await context.Wizards.AddAsync(wizard);
                await context.SaveChangesAsync();

                return wizard;
            }
        }

        public async Task<Wizard> DeleteAsync(int wizardId)
        {
            if (wizardId == 0)
            {
                throw new ArgumentException($"Expected a valid Id but instead received: {wizardId}");
            }

            using (var context = this._context)
            {
                var wizard = context.Wizards.Find(wizardId);

                context.WizardSpells.RemoveRange(context.WizardSpells.Where(ws => ws.WizardId == wizardId));
                context.MagicItems.RemoveRange(context.MagicItems.Where(mi => mi.WizardId == wizardId));
                context.Wizards.Remove(wizard);
                await context.SaveChangesAsync();

                return wizard;
            }
        }

        public async Task<Wizard> UpdateAsync(Wizard wizard)
        {
            using (var context = this._context)
            {
                context.Wizards.Update(wizard);
                var newWizardSpells = wizard.WizardSpells.Where(ws => !context.WizardSpells.Contains(ws));
                var removedWizardSpells = context.WizardSpells.Where(ws => !wizard.WizardSpells.Contains((ws)));
                await context.WizardSpells.AddRangeAsync(newWizardSpells);
                context.WizardSpells.RemoveRange(removedWizardSpells);
                await context.SaveChangesAsync();
                return wizard;
            }
        }
    }
}