using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("user_items", Schema="mc")]
    public class UserItem
    {
        [Column("user_id")]
        public int UserId { get; set; }
        [Column("item_id")]
        public int ItemId { get; set; }
    }
}