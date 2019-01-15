using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("wizards", Schema = "dbo")]
    public class Wizard
    {
        [Key]
        public int WizardId { get; set; }
        public string Name { get; set; }
        public Decimal Mana { get; set; }
        public string Description { get; set; }
        public ICollection<WizardSpell> WizardSpells { get; set; }
    }
}