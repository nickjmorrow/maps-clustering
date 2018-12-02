using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("wizardSpells", Schema = "dbo")]
    public class WizardSpell
    {
        public Wizard Wizard { get; set; }
        public int WizardId { get; set; }
        public Spell Spell { get; set; }
        public int SpellId { get; set; }
    }
}