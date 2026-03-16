# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e6]:
    - generic [ref=e7]:
      - img [ref=e10]
      - heading "OKE MEKANIK" [level=3] [ref=e12]
      - paragraph [ref=e13]: Masuk ke masa depan servis kendaraan
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]:
          - text: Email
          - textbox "Email" [ref=e17]:
            - /placeholder: nama@email.com
            - text: customer@example.com
        - generic [ref=e18]:
          - text: Password
          - textbox "Password" [active] [ref=e19]:
            - /placeholder: "******"
            - text: password123
        - generic [ref=e20]:
          - text: Masuk sebagai
          - combobox [ref=e21] [cursor=pointer]:
            - generic: Pelanggan
            - img [ref=e22]
          - combobox [ref=e24]
      - generic [ref=e25]:
        - button "MASUK SEKARANG" [ref=e26] [cursor=pointer]
        - paragraph [ref=e27]:
          - text: Belum punya akun?
          - link "Daftar sekarang" [ref=e28] [cursor=pointer]:
            - /url: /register
```