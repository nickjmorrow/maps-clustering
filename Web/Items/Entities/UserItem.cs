using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("userItems", Schema="mc")]
    public class UserItem
    {
        public int UserId { get; set; }
        public int ItemId { get; set; }
    }
}