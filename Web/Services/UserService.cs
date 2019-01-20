using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebApplication.Helpers;
using WebApplication.Models;

namespace WebApplication.Services
{
    public interface IUserService
    {
        User Authenticate(AuthInfo authInfo);
        User Register(User user);
    }

    public class UserService : IUserService
    {
        private DatabaseContext _context;
        private AppSettings _appSettings;

        public UserService(DatabaseContext context, IOptions<AppSettings> appSettings)
        {
            this._context = context;
            this._appSettings = appSettings.Value;
        }

        public User Authenticate(AuthInfo authInfo)
        {
            using (var context = this._context)
            {
                var user = context.Users.SingleOrDefault(u => u.Email == authInfo.Email);
                if (user == null)
                {
                    return new AuthResponse() {ErrorText = "No user could be found with that email"};
                }

                try
                {
                    var doesPasswordMatch = this.DoesPasswordMatch(authInfo, user);
                    // return null if user not found
                    if (!doesPasswordMatch)
                    {
                        return new AuthResponse() {ErrorText = "User with that email and password cannot be found."};
                    }
                }
                catch (System.FormatException)
                {
                    return new AuthResponse() {ErrorText = "Password formatted incorrectly."};
                }
                
                // successful authentication, so generate jwt token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(this._appSettings.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, user.UserId.ToString()),
                    }),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                user.Token = tokenHandler.WriteToken(token);

                // remove password before returning
                user.Password = null;

                return user;
            }
        }

        public User Register(User user)
        {
            using (var context = this._context)
            {
                var hasUserWithSameEmail = context.Users
                    .Any(u => u.Email == user.Email);
                if (hasUserWithSameEmail)
                {
                    return new AuthResponse()
                    {
                        ErrorText = "User with that email already exists."
                    };
                }

                user.Password = this.EncryptPassword(user.Password);
                context.Users.Add(user);
                context.SaveChanges();

                var persistedUser = context.Users.SingleOrDefault(u => u.Email == user.Email);
                if (persistedUser == null)
                {
                    throw new Exception("User could not be found after persistence to database.");
                }

                return persistedUser;
            }
        }

        private string EncryptPassword(string plainTextPassword)
        {
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            var pbkdf2 = new Rfc2898DeriveBytes(plainTextPassword, salt, 10000);
            byte[] hash = pbkdf2.GetBytes(20);

            byte[] hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);
            return Convert.ToBase64String(hashBytes);

        }

        private bool DoesPasswordMatch(AuthInfo authInfo, User user)
        {
            var plainTextPassword = authInfo.Password;
            var encryptedPassword = user.Password;

            byte[] hashBytes = Convert.FromBase64String(encryptedPassword);
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            var pbkdf2 = new Rfc2898DeriveBytes(plainTextPassword, salt, 10000);
            byte[] hash = pbkdf2.GetBytes(20);

            var doesMatch = true;
            for (var i = 0; i < 20; i++)
            {
                if (hashBytes[i + 16] != hash[i])
                {
                    doesMatch = false;
                }
            }

            return doesMatch;
        }
    }
}