using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("items", Schema="dbo")]
    public class Item
    {
        [Key] 
        public int ItemId { get; set; }
        public int ItemTypeId { get; set; }
    }
}