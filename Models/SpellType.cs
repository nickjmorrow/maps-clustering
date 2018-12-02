using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("spellTypes", Schema = "dbo")]
    public class SpellType
    {
        [Key]
        public int SpellTypeId { get; set; }
        public string name { get; set; }
    }
}