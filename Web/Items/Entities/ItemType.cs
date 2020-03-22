using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("item_types", Schema="mc")]
    public class ItemType
    {
        [Key, Column("item_type_id")]
        public int ItemTypeId { get; set; }
        [Column("name")]
        public string Name { get; set; }
    }
}