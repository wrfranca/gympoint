module.exports = {
  dialect: 'postgres',
  host: '192.168.11.140',
  username: 'postgres',
  password: 'docker',
  database: 'Gympoint',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
}
