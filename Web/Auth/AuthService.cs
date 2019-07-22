using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebApplication.Helpers;
using WebApplication.Models;

namespace WebApplication.Services
{
    public class AuthService
    {
        private DatabaseContext _context;
        private AppSettings _appSettings;

        public AuthService(DatabaseContext context, IOptions<AppSettings> appSettings)
        {
            this._context = context;
            this._appSettings = appSettings.Value;
        }

        public async Task<User> Authenticate(AuthInfo authInfo)
        {
            var user = await this._context.Users
                .SingleOrDefaultAsync(u => u.Email == authInfo.Email);
            if (user == null)
            {
                return new AuthResponse() {ErrorText = $"No user could be found with the email: {authInfo.Email}"};
            }

            if (!this.DoesPasswordMatch(authInfo, user))
            {
                return new AuthResponse {ErrorText = "User with that email and password cannot be found."};
            }

            user.Token = this.GetToken(user);

            // remove password before returning
            user.Password = null;

            return user;
        }

        public async Task<User> AuthenticateGoogle(User googleUser)
        {
            var payload = GoogleJsonWebSignature
                .ValidateAsync(googleUser.Token, new GoogleJsonWebSignature.ValidationSettings()).Result;
            var user = await this._context.Users
                .FirstOrDefaultAsync(u => u.Email.Equals(payload.Email));
            if (user == null)
            {
                var newUser = new User
                {
                    Email = payload.Email,
                    Name = payload.Name
                };

                await this._context.AddAsync(newUser);
                await this._context.SaveChangesAsync();
                user = newUser;
            }

            return new User
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Token = this.GetToken(user)
            };
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
        
        private string GetToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(this._appSettings.Secret);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserId.ToString())
            };
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }
    }
}