using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("userFavorites", Schema="dbo")]
    public class UserFavoriteItem
    {
        public int UserId { get; set; }
        public int ItemId { get; set; }
    }
}