using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("userFavorites", Schema="mapClustering")]
    public class UserFavoriteItem
    {
        
        public int UserId { get; set; }
        public int ItemId { get; set; }
    }
}