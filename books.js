

const app= Vue.createApp({
    
    data(){
        return {
        books: [
    {          
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    img: '../images/1.jpg',
    isFav: true
    },
  
  {
    title: "1984",
    author: "George Orwell",
    img: '../images/2.jpg',
    isFav: false
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    img: '../images/3.jpg',
    isFav: true
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    img: '../images/4.jpg',
    isFav: false
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    img: '../images/5.jpg',
    isFav: true
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    img: '../images/6.jpg',
    isFav: false
  },
  {
    title: "The Harry Potter Series",
    author: "J.K. Rowling",
    img: '../images/7.jpg',
    isFav: false
  }
        ]
    }
    }
}).mount('#app');