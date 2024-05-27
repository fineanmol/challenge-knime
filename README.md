# Project Title


This project is a web application built with React and Tailwind CSS, utilizing Redux for state management. The application features a dynamic workflow editor where users can add and move nodes within a canvas. It includes components such as a search bar to filter and add nodes to the workflow.


## Technologies Used

- **React**
- **Redux**
- **Tailwind CSS**
- **TypeScript**

## Deployment Path

   ```

The project is running on `http://localhost:3000`.

## Project Structure

```
project-name/
├── public/
│   ├── index.html
├── src/
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── Workflow.tsx
│   ├── store/
│   │   ├── workflow.ts
│   │   ├── store.ts
│   ├── helpers/
│   │   ├── canvasHelper.ts
│   ├── types/
│   │   ├── dataTypes.ts
│   ├── views/
│   │   ├── HomeView.tsx
│   ├── App.tsx
│   ├── index.tsx
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
```

## Instead of HTTP Response, Mocked Data Used
- The Mocked data is present in `src/dataMock.ts` file.