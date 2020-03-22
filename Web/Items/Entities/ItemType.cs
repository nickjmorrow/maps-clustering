using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("itemTypes", Schema="mc")]
    public class ItemType
    {
        [Key]
        public int ItemTypeId { get; set; }
        public string Name { get; set; }
    }
}