// import { BloggersController } from '../src/bloggers/bloggers.controller';
// import { BloggersRepository } from '../src/bloggers/bloggers.repository';
// import { BloggersService } from '../src/bloggers/bloggers.service';
// import {PostsRepository} from '../src/posts/posts.repository'
// import {PostsHelper } from '../src/posts/serviceHelper/postshelper.service'

// describe('BloggersController', () => {
//     let bloggersRepository: BloggersRepository;
//     let postsRepository: PostsRepository;
//     let postHelperClass: PostsHelper;
//   let bloggersController: BloggersController;
//   let bloggersService: BloggersService;

//   beforeEach(() => {
//     (bloggersRepository = new BloggersRepository(),
//       postsRepository = new PostsRepository(),
//       postHelperClass = new PostsHelper(),
//       bloggersService = new BloggersService(),
//     bloggersController = new BloggersController(bloggersService));
//   });

//   describe('findAll', () => {
//     it('should return an array of cats', async () => {
//       const result = ['bloggers'];
//       jest.spyOn(bloggersService, 'findAll').mockImplementation(() => result);

//       expect(await bloggersController.findAll()).toBe(result);
//     });
//   });
// function PostsRepository(): any {
//     throw new Error('Function not implemented.');
// }
