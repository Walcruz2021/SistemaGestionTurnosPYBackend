import * as chai from 'chai'; // Importa todo el módulo de Chai
import chaiHttp from 'chai-http';
import app from '../index.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Test de rutas', () => {
  it('Debería devolver un mensaje en /api', (done) => {
    chai.request(app)
      .get('/api')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'Ruta funcionando!');
        done();
      });
  });
});
