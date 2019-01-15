using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("spells", Schema = "dbo")]
    public class Spell
    {
        [Key]
        public int SpellId { get; set; }
        public string SpellType { get; set; }
        public string Incantation { get; set; }
        public Decimal Cost { get; set; }
        public ICollection<WizardSpell> WizardSpells { get; set; }
    }
}