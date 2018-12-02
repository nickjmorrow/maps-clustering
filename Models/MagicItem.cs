using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("magicItems", Schema = "dbo")]
    public class MagicItem
    {
        [Key]
        public int MagicItemId { get; set; }
        public string Name { get; set; }
        [ForeignKey("Wizard")]
        public int? WizardId { get; set; }
    }
}