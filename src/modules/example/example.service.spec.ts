import { ExampleService } from './example.service';

describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(() => {
    service = new ExampleService();
  });

  it('returns seeded records', () => {
    const examples = service.findAll();

    expect(examples).toHaveLength(1);
    expect(examples[0]).toMatchObject({
      name: 'Welcome example',
      isActive: true,
    });
  });

  it('creates a new record in memory', () => {
    const created = service.create({
      name: 'Created example',
      description: 'Created inside a unit test',
      isActive: false,
    });

    expect(created).toMatchObject({
      name: 'Created example',
      description: 'Created inside a unit test',
      isActive: false,
    });
    expect(service.findAll()).toHaveLength(2);
  });
});
