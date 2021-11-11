import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();

    constructor(private httpClient: HttpClient){}

    getPosts() {
        this.httpClient.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
        .pipe(map((postData)=>{
            return postData.posts.map((post: { title: any; content: any; _id: any; }) => {
                return{
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
        .subscribe((transformedPosts) => {
            this.posts = transformedPosts;
            this.postUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }

    addPost(title: string, content: string){
        const post: Post = {id: '', title: title, content: content};
        this.httpClient.post<{message: string, postId: string}>("http://localhost:3000/api/posts", post)
        .subscribe((responseData)=>{
            const id = responseData.postId;
            post.id = id;
            this.posts.push(post);
            this.postUpdated.next([...this.posts])
        });  
    }
    deletePost(postId: string){
        this.httpClient.delete("http://localhost:3000/api/posts/"+ postId)
        .subscribe(()=>{
            const updatedPosts = this.posts.filter(post => post.id!==postId);
            this.posts = updatedPosts;
            this.postUpdated.next([...this.posts])
        });
    }
}