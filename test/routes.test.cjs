const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

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

// import * as chai from 'chai'; // Importación completa de Chai como un objeto
// import chaiHttp from 'chai-http';
// import app from '../app.js';

// chai.use(chaiHttp);
// const { expect } = chai;

// describe('Test de rutas', () => {
//   it('Debería devolver un mensaje en /api', (done) => {
//     chai.request(app)
//       .get('/api')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('message', 'Ruta funcionando!');
//         done();
//       });
//   });
// });
