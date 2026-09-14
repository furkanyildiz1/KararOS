using System.Security.Cryptography;
using KararOS.Application.Common.Interfaces;

namespace KararOS.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16; //128 bit benzersiz veri ekliyoruz
    private const int KeySize = 32;//256bit hash uzunluğunu
    private const int Iterations = 100000;
    private static readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA256;

    public string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, Algorithm, KeySize);

        //format : {salt} : {hash} {base64}
        return $"{Convert.ToBase64String(salt)}: {Convert.ToBase64String(hash)}";
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        var parts = passwordHash.Split(':');
        if (parts.Length != 2) return false;

        byte[] salt = Convert.FromBase64String(parts[0]);
        byte[] exceptedHash = Convert.FromBase64String(parts[1]);

        byte[] actaulHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, Algorithm, KeySize);

        return CryptographicOperations.FixedTimeEquals(actaulHash, exceptedHash);
    }
}