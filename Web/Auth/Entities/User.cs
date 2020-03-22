using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("Users", Schema = "mc")]
    public class User
    {
        [Key, Column("user_id")]
        public int? UserId { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("email")]
        public string Email { get; set; }
        [Column("password")]
        public string Password { get; set; }
        [Column("token")]
        public string Token { get; set; }
    }
}